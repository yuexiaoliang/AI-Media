import { saveNpmPackages } from './npm-packages/services';

saveNpmPackages([
  {
    pkg: 'isarray',
    title: '阿珂就不看就不看就',
    tags: ['abc', 'array']
  },
  {
    pkg: 'isarray1',
    tags: ['def', 'array']
  },
  {
    pkg: 'isarray2',
    tags: ['array']
  }
]).then(([success, error]) => {
  console.log('success:', success);
  console.log('error:', error);
})
