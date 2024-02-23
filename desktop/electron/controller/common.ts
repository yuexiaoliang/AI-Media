import path from 'path';

const p = path.resolve(__dirname, '../../dist');

export const getProjects = () => {
  return [
    {
      name: 'english-words',
      path: path.resolve(p, 'english-words')
    }
  ];
};
