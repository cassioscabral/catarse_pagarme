App.views.PagarmeForm.addChild('PaymentSlip', {
  el: '#payment_type_slip_section',

  events: {
    'click input#build_boleto' : 'onBuildBoletoClick',
    'click .link_content a' : 'onContentClick',
  },

  activate: function(options){
    this.PagarmeForm = this.parent;
    this.message = this.$('.alert-danger');
    this.$('#user_bank_account_attributes_name').brbanks();
  },

  onContentClick: function() {
    var thank_you = $('#project_review').data('thank-you-path');

    if(thank_you){
      location.href = thank_you;
    } else {
      location.href = '/';
    }
  },

  onBuildBoletoClick: function(e){
    var that = this;
    var parent = this.parent;

    e.preventDefault();
    $(e.currentTarget).hide();
    that.PagarmeForm.loader.show();

    var bankAccountAttributes = {
      user: {
        bank_account_attributes: {
          name: that.$('input#user_bank_account_attributes_name').val(),
          agency: that.$('input#user_bank_account_attributes_agency').val(),
          agency_digit: that.$('input#user_bank_account_attributes_agency_digit').val(),
          account: that.$('input#user_bank_account_attributes_account').val(),
          account_digit: that.$('input#user_bank_account_attributes_account_digit').val(),
          user_name: that.$('input#user_bank_account_attributes_user_name').val(),
          user_document: that.$('input#user_bank_account_attributes_user_document').val()
        }
      }
    };

    $.post('/payment/pagarme/'+that.PagarmeForm.contributionId+'/pay_slip', bankAccountAttributes).success(function(response){
      parent.loader.hide();
      if(response.payment_status == 'failed'){
        that.message.find('p').html(response.message);
        that.message.fadeIn('fast')

        $(e.currentTarget).show();
      } else if(response.boleto_url) {
        var link = $('<a target="__blank">'+response.boleto_url+'</a>')
        link.attr('href', response.boleto_url);
        that.$('.link_content').empty().html(link);
        that.$('.payment_section:visible .subtitle').fadeIn('fast');
      }
    });
  }

});
