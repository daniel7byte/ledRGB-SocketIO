(function() {
  var socket = io.connect(window.location.hostname + ':' + 3000);
  var red = document.getElementById('red');
  var green = document.getElementById('green');
  var blue = document.getElementById('blue');

  function emitValue(color, e) {
    socket.emit('rgb', {
      color: color,
      value: e.target.value
    });
  }

  red.addEventListener('change', emitValue.bind(null, 'red'));
  blue.addEventListener('change', emitValue.bind(null, 'blue'));
  green.addEventListener('change', emitValue.bind(null, 'green'));

  socket.on('connect', function(data) {
    socket.emit('join', 'Client is connected!');
  });

  socket.on('rgb', function(data) {
    var color = data.color;
    document.getElementById(color).value = data.value;
  });

  // PONDRÁ LOS VALORES POR DEFECTO DE SERVIDOR
  socket.on('defaultValues', function(data) {

    // informacion
    // console.log(data);

    // key es el nombre de la llave o puesto del objeto
    for (var key in data) {

      /*
      console.log(key);       //puesto, nombre del color
      console.log(data[key]); // Llave del color
      */

      var color = key;
      document.getElementById(color).value = data[key];
    }
  });
}());
