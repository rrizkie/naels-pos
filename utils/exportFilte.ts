const exportFile = (file: any, name: string) => {
  const docs = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement("a");
  link.href = docs;
  link.setAttribute("download", `${name}`);
  document.body.appendChild(link);
  link.click();
};

export default exportFile;
