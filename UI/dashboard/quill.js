var quill = new Quill('#content', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ]
    },
    placeholder: 'Compose a topic...',
    theme: 'snow'  // or 'bubble'
  });