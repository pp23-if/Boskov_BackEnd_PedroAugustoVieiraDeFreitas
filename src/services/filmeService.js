const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function importarFilmes() {
  try {
    const filmesExistem = await prisma.filme.count();
    if (filmesExistem > 0) {
      console.log('📦 Filmes já importados. Ignorando nova importação.');
      return;
    }

    console.log('🔄 Buscando gêneros...');
    const generoResponse = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
      },
    });

    const generoMap = new Map();
    generoResponse.data.genres.forEach((g) => {
      generoMap.set(g.id, g.name);
    });

    console.log('🎬 Buscando filmes em cartaz...');
    let filmes = [];
    let pagina = 1;

    while (filmes.length < 50) {
      const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
          region: 'BR',
          page: pagina,
        },
      });

      filmes = filmes.concat(response.data.results);
      pagina++;
      if (pagina > response.data.total_pages || filmes.length >= 50) break;
    }

    filmes = filmes.slice(0, 50);

    for (const filme of filmes) {
      const { id, title, release_date, poster_path, genre_ids } = filme;

      // Busca detalhes do filme (runtime e overview)
      const detalhesFilme = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
        },
      });

      const duracao = detalhesFilme.data.runtime || 0;
      const produtora = detalhesFilme.data.production_companies?.[0]?.name || 'Desconhecida';
      const sinopse = detalhesFilme.data.overview || 'Sem sinopse disponível';

      // Busca classificação indicativa brasileira
      const releaseDates = await axios.get(`${BASE_URL}/movie/${id}/release_dates`, {
        params: {
          api_key: API_KEY,
        },
      });

      const classificacaoBR = releaseDates.data.results.find(
        (release) => release.iso_3166_1 === 'BR'
      )?.release_dates[0]?.certification || 'Indefinida';

      // Busca diretor
      const creditos = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
        },
      });

      const diretor = creditos.data.crew.find((m) => m.job === 'Director')?.name || 'Desconhecido';

      // Inserir gêneros no banco
      const generos = await Promise.all(
        genre_ids.map(async (genreId) => {
          const descricao = generoMap.get(genreId) || `Gênero ${genreId}`;
          return prisma.genero.upsert({
            where: { id: genreId },
            update: {},
            create: {
              id: genreId,
              descricao,
            },
          });
        })
      );

      // Criar filme
      const filmeCriado = await prisma.filme.create({
        data: {
          id,
          nome: title,
          sinopse,
          ano_lancamento: new Date(release_date),
          duracao,
          diretor,
          produtora,
          classificacao: classificacaoBR,
          poster: poster_path
            ? `https://image.tmdb.org/t/p/w185${poster_path}`
            : '',

          genero_filme: {
            create: generos.map((g) => ({
              id_genero: g.id,
            })),
          },
        },
      });

      console.log(`✅ Inserido: ${filmeCriado.nome}`);
    }

    console.log('🚀 Importação concluída com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao importar filmes:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { importarFilmes };
