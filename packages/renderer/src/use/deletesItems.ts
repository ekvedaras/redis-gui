export function useDeletesItems(
  afterDeleteItem?: () => void,
) {
  return (item: any, action: string) => {
    alert('TODO show modal to confirm delete');
    // this.$modal.show(
    //   Dialog,
    //   {
    //     text: `Are you sure you want to delete <b>${(typeof item === "object" ? item.label : item).substr(0, 50)}</b> item from ${this.name}?`,
    //     dangerBtn: true,
    //     handler: () => {
    //       this.$store.dispatch(action, { keyName: this.name, item }).then(async () => {
    //         await this.afterDeleteItem();
    //         this.loadKeys();
    //       });
    //       this.$modal.hide("dialog");
    //     }
    //   },
    //   { name: "dialog" }
    // );
  }
}
