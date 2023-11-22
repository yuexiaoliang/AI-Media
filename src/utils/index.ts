// This function replaces all instances of [[KEY]] in the given template
// with the corresponding value in the values object.
//
// For example, if the template is 'Hello, [[NAME]]' and the values object is
// { NAME: 'John' }, then the result is 'Hello, John'.
export function renderTemplate(template: string, values: { [key: string]: string }): string {
  return template.replace(/\[\[(\w+)\]\]/g, (match, key) => {
    return key in values ? values[key] : match;
  });
}
