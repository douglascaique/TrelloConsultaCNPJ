TrelloPowerUp.initialize({
    'card-buttons': function(t, options) {
      return [{
        icon: './icon.svg',
        text: 'Consultar CNPJ',
        callback: function(t) {
          // Obter as informações do cartão, incluindo campos customizados
          return t.card('all')
            .then(function(card) {
              // Supondo que os custom fields estejam em "card.customFieldItems".
              // Você precisará identificar o ID do campo que contém o CNPJ.
              let cnpjField = card.customFieldItems && card.customFieldItems.find(field => field.idCustomField === 'seu_id_campo_cnpj');
  
              if (cnpjField && cnpjField.value && cnpjField.value.text) {
                // Chama a função que irá consultar o CNPJ
                return consultarCNPJ(cnpjField.value.text, t);
              } else {
                return t.alert({ message: 'CNPJ não encontrado no campo customizado!' });
              }
            });
        }
      }];
    }
  });
  


  function consultarCNPJ(cnpj, t) {
    // Valide e formate o CNPJ se necessário
  
    // Exemplo de endpoint – substitua por um serviço real que retorne os dados
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na consulta do CNPJ');
        }
        return response.json();
      })
      .then(data => {
        // Extraia os dados relevantes: razão social, município, email, regime tributário, CNAEs
        // Você pode exibir essas informações em um popup, badge ou atualizar os campos do cartão.
        return t.popup({
          title: 'Detalhes do CNPJ',
          url: './popup.html', // Crie este arquivo para renderizar os dados
          height: 300,
          args: { data: data }
        });
      })
      .catch(error => {
        return t.alert({ message: `Erro: ${error.message}` });
      });
  }
  