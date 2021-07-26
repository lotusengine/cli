export default (str: any) => str.replace(/\u001b[^m]*m/g, '').length;
