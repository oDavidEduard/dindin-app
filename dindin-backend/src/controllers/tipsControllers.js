import { prisma } from "../index.js";

const tipsDatabase = {
    1: [ //Alimentação
        "Planeje suas refeições da semana antes de ir ao mercado.",
        "Evite ir ao supermercado com fome.",
        "Leve comida de casa para o trabalho em vez de comer fora",
        "Cozinhe porções maiores e congele para evitar gastos durante a semana.",
        "Troque marcas famosas por marcas próprias do mercado, geralmente mais baratas.",
        "Use aplicativos de desconto para comprar alimentos próximos da validade."
    ],
    2: [ //Transporte
        "Considere usar transporte público ou bicicleta",
        "Mantenha a manutenção do seu carro em dia para economizar",
        "Use aplicativos de carona solidária para dividir custos.",
        "Organize suas rotas para evitar trajetos duplicados e economizar combustível.",
        "Verifique a calibragem dos pneus — isso reduz o consumo de gasolina.",
        "Se puder, combine horários para ir e voltar com alguém do seu bairro."
    ],
    3: [ //Lazer
        "Procure por eventos gratuitos na sua cidade (shows, parques, feiras).",
        "Assine serviços de streaming em grupo ou plano familiar.",
        "Estabeleça um limite fixo para saídas noturnas.",
        "Troque uma saída cara por um dia de atividades caseiras: filmes, jogos, culinária.",
        "Em vez de comprar livros, use bibliotecas ou aplicativos gratuitos.",
        "Use cupons e datas de promoção quando for ao cinema ou restaurantes."
    ],
    4: [ //Moradia
        "Apague as luzes ao sair dos cômodos e aproveite a luz natural.",
        "Verifique vazamentos de água, eles podem encarecer muito a conta.",
        "Desligue aparelhos da tomada quando não estiverem em uso.",
        "Use ventilação cruzada antes de ligar o ar-condicionado.",
        "Ajuste a geladeira para uma temperatura adequada — frio demais gasta mais energia.",
        "Tome banhos mais curtos para reduzir a conta de energia e água."
    ],
    5: [ //Outros
        "Crie uma reserva de emergência com pequenos valores mensais.",
        "Espere 24 horas antes de fazer uma compra por impulso.",
        "Compare preços online antes de comprar eletrodomésticos.",
        "Anote todas as suas despesas diárias, mesmo as pequenas, para identificar desperdícios.",
        "Negocie preços à vista sempre que possível.",
        "Revise assinaturas que você não usa mais: apps, clubes, serviços."
    ]
};

export const getTips = async(req,res) => {

    const { categoryId } = req.query;

    if(categoryId && tipsDatabase[categoryId]){
        const tipsList = tipsDatabase[categoryId];
        const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
        return res.json({ tip: randomTip });
    }

    return res.json({ tip: "A regra 50-30-20 ajuda a organizar seu orçamento: 50% essencial, 30% desejos, 20% poupança." })
}