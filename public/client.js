// var t = TrelloPowerUp.iframe();

// const CNPJ_FIELD_NAME = "CNPJ"; // Nome do custom field usado para armazenar o CNPJ

// window.TrelloPowerUp.initialize({
//   'card-buttons': function(t, options) {
//     return [{
//       icon: 'https://image.flaticon.com/icons/png/512/888/888879.png', // ícone do botão
//       text: 'Consultar CNPJ',
//       callback: function(t) {
//         return t.card('all').then(function(card) {
//           const customField = card.customFieldItems?.find(field => field.name === CNPJ_FIELD_NAME);

//           if (!customField || !customField.value.text) {
//             alert('CNPJ não encontrado no cartão.');
//             return;
//           }

//           const cnpj = customField.value.text.replace(/\D/g, ''); // Limpa máscara

//           return fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
//             .then(response => response.json())
//             .then(data => {
//               alert(`Empresa: ${data.razao_social}\nMunicípio: ${data.municipio}\nRegime Tributário: ${data.descricao_situacao_cadastral}\nCNAE: ${data.cnae_fiscal_descricao}\nEmail: ${data.email}`);
//             })
//             .catch(error => {
//               console.error(error);
//               alert('Erro ao buscar dados do CNPJ.');
//             });
//         });
//       }
//     }];
//   }
// });

window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      text: 'Buscar dados do CNPJ',
      callback: async function (t) {
        const card = await t.card('all');

        // 🔍 Achar o campo personalizado "CNPJ"
        const customFields = card.customFieldItems || [];
        const cnpjField = customFields.find(f => f.value && f.value.text);

        const cnpj = cnpjField ? cnpjField.value.text : null;

        if (!cnpj) {
          return t.alert({ message: 'Campo "CNPJ" não encontrado ou vazio.', duration: 4 });
        }

        try {
          const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
          if (!response.ok) throw new Error("Erro ao consultar CNPJ");
          const data = await response.json();

          const info = `
            ${data.razao_social}\n
            ${data.nome_fantasia}\n
            ${data.cnpj}\n
            ${data.municipio} - ${data.uf}\n
            ${data.data_inicio_atividade}
          `;

          return t.popup({
            title: 'Dados da Empresa',
            url: 'about:blank', // pode apontar pra uma tela HTML mais bonita se quiser depois
            height: 230,
            args: { info }
          }).catch(() => {
            return t.alert({ message: 'Erro ao mostrar popup', duration: 3 });
          });

        } catch (err) {
          return t.alert({ message: 'Erro na consulta da Brasil API', duration: 5 });
        }
      }
    }];
  }
});
