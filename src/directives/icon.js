export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`;

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    if (binding.modifiers.right) {
      iconClass += ' float-right';
    }

    if (binding.modifiers.yellow) {
      iconClass += ' text-yellow-400';
    } else {
      iconClass += ' text-green-400';
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
};

/* The binding object holds the value that gets passed into the directive;
   its possible to access the value through the .value property 
  
  Modifiers are stored in the binding object under a property called modifiers

  const iconClass = `fa fa-headphones-alt float-right text-green-400 text-xl`;
*/
