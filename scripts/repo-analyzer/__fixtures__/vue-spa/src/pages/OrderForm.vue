<template>
  <form>
    <!-- rung 4: a $t() label resolved through the catalogue -->
    <oxd-input-field :label="$t('general.order_name')" />
    <!-- rung 4: a literal label, widened to a textarea by its type -->
    <oxd-input-field label="Notes" type="textarea" />
    <!-- rung 1: a test id outranks everything else on the element -->
    <input data-testid="order-id" />
    <!-- rung 5: nothing but a placeholder -->
    <oxd-input-field placeholder="Search orders" />
    <!-- rung 6: nothing but a name attribute -->
    <input name="quantity" />
    <!-- rung 4: anchored to its first column heading -->
    <oxd-card-table :headers="headers" />
    <!-- rung 2: the call-site label overrides the wrapper's own default -->
    <submit-button :label="$t('general.place_order')" />
  </form>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {name: 'quantity', title: this.$t('general.quantity_column')},
        {name: 'notes', title: 'Notes'},
      ],
    };
  },
};
</script>
