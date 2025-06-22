const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de trÃªs perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando o cadastro de uma resposta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital da França?');
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, 'Paris');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
  expect(respostas[0].id_resposta).toBe(id_resposta);
});

test('Testando a busca de uma pergunta por ID', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Esta pergunta existe?');
  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.id_pergunta).toBe(id_pergunta);
  expect(pergunta.texto).toBe('Esta pergunta existe?');
});

test('Testando a busca de pergunta com ID inexistente', () => {
  const pergunta = modelo.get_pergunta(999);
  expect(pergunta).toBeUndefined();
});

test('Testando o número de respostas de uma pergunta', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Pergunta para contar respostas');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(0);

  modelo.cadastrar_resposta(id_pergunta, 'Resposta 1');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(1);

  modelo.cadastrar_resposta(id_pergunta, 'Resposta 2');
  expect(modelo.get_num_respostas(id_pergunta)).toBe(2);
});

test('Testando listar perguntas com contagem de respostas correta', () => {
  const id_p1 = modelo.cadastrar_pergunta('P1');
  const id_p2 = modelo.cadastrar_pergunta('P2');
  modelo.cadastrar_resposta(id_p1, 'R1');
  modelo.cadastrar_resposta(id_p1, 'R2');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas[0].num_respostas).toBe(2);
  expect(perguntas[1].num_respostas).toBe(0);
});