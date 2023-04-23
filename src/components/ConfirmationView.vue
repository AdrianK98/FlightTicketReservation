<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>

        </div>
        <div class="modal-body">
          {{ message }} {{ seatId }} ?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close()">Cancel</button>
          <button type="button" class="btn btn-primary" @click="confirm()">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    seatId: Number,
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm', this.seatId);
    },
  },
};
</script>
