package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.models.Usuario;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;
import tecnm.equipo4.barberoApi.repositories.UsuarioRepository;

import java.util.*;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final BarberoRepository barberoRepository;

    // Obtener los turnos del cliente con el nombre real del barbero asignado
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Map<String, Object>>> obtenerTurnosPorCliente(@PathVariable Long idCliente) {
        List<Turno> turnos = turnoRepository.buscarPorCliente(idCliente);

        List<Map<String, Object>> respuesta = new ArrayList<>();
        for (Turno t : turnos) {
            Map<String, Object> item = new HashMap<>();
            item.put("idTurno", t.getIdTurno());
            item.put("fecha", t.getFecha());
            item.put("horaInicio", t.getHoraInicio());
            item.put("notasCliente", t.getNotasCliente());
            item.put("estado", t.getEstado());
            item.put("sucursal", t.getSucursal());
            item.put("idCliente", t.getIdCliente());
            item.put("idBarbero", t.getIdBarbero());

            // Buscar el nombre del barbero asignado a este turno
            if (t.getIdBarbero() != null) {
                Optional<Usuario> barberoOpt = usuarioRepository.findById(t.getIdBarbero());
                if (barberoOpt.isPresent()) {
                    item.put("nombreBarbero", barberoOpt.get().getNombreCompleto());
                } else {
                    item.put("nombreBarbero", "Barbero #" + t.getIdBarbero());
                }
            } else {
                item.put("nombreBarbero", "No asignado");
            }

            respuesta.add(item);
        }

        return ResponseEntity.ok(respuesta);
    }

    // Obtener los turnos del barbero con el nombre y teléfono del cliente
    @GetMapping("/barbero/{idBarbero}")
    public ResponseEntity<List<Map<String, Object>>> obtenerTurnosPorBarbero(@PathVariable Long idBarbero) {
        List<Turno> turnos = turnoRepository.findAll().stream()
                .filter(t -> t.getIdBarbero() != null && t.getIdBarbero().equals(idBarbero))
                .sorted(Comparator.comparing(Turno::getFecha).thenComparing(Turno::getHoraInicio))
                .toList();

        List<Map<String, Object>> respuesta = new ArrayList<>();
        for (Turno t : turnos) {
            Map<String, Object> item = new HashMap<>();
            item.put("idTurno", t.getIdTurno());
            item.put("fecha", t.getFecha());
            item.put("horaInicio", t.getHoraInicio());
            item.put("notasCliente", t.getNotasCliente());
            item.put("estado", t.getEstado());
            item.put("sucursal", t.getSucursal());
            item.put("idCliente", t.getIdCliente());
            item.put("idBarbero", t.getIdBarbero());

            if (t.getIdCliente() != null) {
                Optional<Usuario> clienteOpt = usuarioRepository.findById(t.getIdCliente());
                if (clienteOpt.isPresent()) {
                    Usuario c = clienteOpt.get();
                    item.put("nombreCliente", c.getNombreCompleto());
                    item.put("telefonoCliente", c.getTelefono() != null ? c.getTelefono() : "+52 231 112 6081");
                } else {
                    item.put("nombreCliente", "Cliente #" + t.getIdCliente());
                    item.put("telefonoCliente", "+52 231 112 6081");
                }
            } else {
                item.put("nombreCliente", "Cliente General");
                item.put("telefonoCliente", "+52 231 112 6081");
            }
            respuesta.add(item);
        }

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping
    public ResponseEntity<?> agendarTurno(@RequestBody Turno turno) {
        try {
            if (turno.getEstado() == null || turno.getEstado().trim().isEmpty()) {
                turno.setEstado("CONFIRMADO");
            }
            if (turno.getIdServicio() == null) {
                turno.setIdServicio(1L);
            }
            if (turno.getSucursal() == null || turno.getSucursal().trim().isEmpty()) {
                turno.setSucursal("BarberApp Centro");
            }

            if (turno.getIdBarbero() != null) {
                try {
                    barberoRepository.registrarOActualizarBarbero(turno.getIdBarbero(), 3, "Barbero Profesional");
                } catch (Exception ignored) {}
            }

            Turno nuevoTurno = turnoRepository.save(turno);
            return ResponseEntity.ok(nuevoTurno);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al registrar turno: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarTurno(@PathVariable Long id) {
        Optional<Turno> turnoOpt = turnoRepository.findById(id);
        if (turnoOpt.isPresent()) {
            Turno turno = turnoOpt.get();
            turno.setEstado("CONFIRMADO");
            return ResponseEntity.ok(turnoRepository.save(turno));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarTurno(@PathVariable Long id) {
        Optional<Turno> turnoOpt = turnoRepository.findById(id);
        if (turnoOpt.isPresent()) {
            Turno turno = turnoOpt.get();
            turno.setEstado("CANCELADO");
            return ResponseEntity.ok(turnoRepository.save(turno));
        }
        return ResponseEntity.notFound().build();
    }
}