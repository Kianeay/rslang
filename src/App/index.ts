import Controller from './components/Controller';

const App = (root: Element) => {
  const appController = new Controller(root);

  return appController;
};

export default App;
