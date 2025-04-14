var t = TrelloPowerUp.iframe();

const CNPJ_FIELD_NAME = "CNPJ"; // Nome do custom field usado para armazenar o CNPJ

window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [{
      icon: 'https://image.flaticon.com/icons/png/512/888/888879.png', // ícone do botão
      text: 'Consultar CNPJ',
      callback: function(t) {
        return t.card('all').then(function(card) {
          const customField = card.customFieldItems?.find(field => field.name === CNPJ_FIELD_NAME);

          if (!customField || !customField.value.text) {
            alert('CNPJ não encontrado no cartão.');
            return;
          }

          const cnpj = customField.value.text.replace(/\D/g, ''); // Limpa máscara

          return fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
            .then(response => response.json())
            .then(data => {
              alert(`Empresa: ${data.razao_social}\nMunicípio: ${data.municipio}\nRegime Tributário: ${data.descricao_situacao_cadastral}\nCNAE: ${data.cnae_fiscal_descricao}\nEmail: ${data.email}`);
            })
            .catch(error => {
              console.error(error);
              alert('Erro ao buscar dados do CNPJ.');
            });
        });
      }
    }];
  }
});
