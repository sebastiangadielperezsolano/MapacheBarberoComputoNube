INSERT INTO barbero (id_barbero, nombreCompleto, telefono, email, password, tipoUsuario, Experiencia, tituloRol, foto)
VALUES (1, 'Jennifer Hernandez Estrada', '2311457865, 'barbero@tecnm.edu.mx', 'Password123!', 'BARBERO', 5, 'Master Barber', NULL);

//Servicio no hay llaves foraneas
INSERT INTO servicio (idServicio, nombreServicio, duracion, precio)
VALUES (1, 'Corte de Cabello y Barba', 45, 180.00);

//Turno sin llaves foraeas
INSERT INTO turno (idTurno, fecha, horaInicio, estado, notasCliente, sucursal)
VALUES (1, '2026-10-25', '2026-10-25 10:00:00', 'PENDIENTE', 'Corte clásico con lavado', 'Sucursal Central');

//Cliente llaves foraneas
INSERT INTO cliente (id_cliente, nombreCompleto, telefono, email, password, tipoUsuario, foto, idBarbero)
VALUES (1, 'Sebastian Gadiel', '2229876543', 'sebastian@mail.com', 'Cliente123!', 'CLIENTE', NULL, 1);

//Disponibilidad
INSERT INTO disponibilidadB (idDisponibilidad, dia, diaEntrada, diaSalida, idUsuario)
VALUES (1, '2026-10-20', '2026-10-20 09:00:00', '2026-10-20 18:00:00', 1);

//Turno sin llaves foraeas
INSERT INTO turno (idTurno, fecha, horaInicio, estado, notasCliente, sucursal)
VALUES (1, '2026-10-25', '2026-10-25 10:00:00', 'PENDIENTE', 'Corte clásico con lavado', 'Sucursal Central');

//Pago
INSERT INTO pago (idPago, montoTotal, metodo, estado, ultimosDigitos, idTurno)
VALUES (1, 250.50, 'TARJETA', 'COMPLETADO', '4321', 1);







