document.addEventListener('DOMContentLoaded', function() {
	function render(component, options = {}) {
		var element = document.getElementById('root');
		React.render(component, element);
	}

	render(<p>Welcome!</p>)
})
