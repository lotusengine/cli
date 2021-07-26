export default (ms: any) => new Promise(resolve => {
  setTimeout(resolve, ms)
});
