
import '../../dist/squid-happy/squid-happy.js';
import readme from './readme.md';
export default {
  title: 'happy'
};

const temp = (args) => {
  return `<squid-happy></squid-happy`;
}

export const happy = temp.bind({});
happy.args ={
  inputMax:'',
  max:'',
  
};
happy.story = {
  name: 'happy',
  parameters: {
    notes: {readme},
    argTypes:{}
  },
};
    