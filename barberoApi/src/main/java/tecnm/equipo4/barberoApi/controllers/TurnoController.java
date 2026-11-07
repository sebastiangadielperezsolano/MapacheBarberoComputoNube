package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Servicio;
import tecnm.equipo4.barberoApi.models.Sucursal;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.services.TurnoService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TurnoController {
    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<Turno>> listarTodos() {
        return ResponseEntity.ok(turnoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turno> obtenerTurnoPorId(@PathVariable Long id) {
        Optional<Turno> turno = turnoService.buscarPorId(id);
        return turno.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Turno>> obtenerTurnosPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(turnoService.listarPorCliente(idCliente));
    }

    @GetMapping("/barbero/{idBarbero}")
    public ResponseEntity<List<Turno>> obtenerTurnosPorBarbero(@PathVariable Long idBarbero) {
        return ResponseEntity.ok(turnoService.listarPorBarbero(idBarbero));
    }

    @GetMapping("/sucursal/{idSucursal}")
    public ResponseEntity<List<Turno>> obtenerTurnosPorSucursal(@PathVariable Long idSucursal) {
        return ResponseEntity.ok(turnoService.listarPorSucursal(idSucursal));
    }

    @GetMapping("/ocupados")
    public ResponseEntity<List<Turno>> obtenerHorariosOcupados(
            @RequestParam Long idBarbero,
            @RequestParam String fecha) {
        return ResponseEntity.ok(turnoService.obtenerHorariosOcupados(idBarbero, fecha));
    }

    @PostMapping
    public ResponseEntity<?> agendarTurno(@RequestBody Map<String, Object> payload) {
        try {
            Turno turno = new Turno();
            turno.setFecha((String) payload.get("fecha"));
            turno.setHoraInicio((String) payload.get("horaInicio"));
            turno.setEstado((String) payload.get("estado"));
            turno.setNotasCliente((String) payload.get("notasCliente"));

            if (payload.get("idCliente") != null) {
                Cliente c = new Cliente();
                c.setIdCliente(Long.valueOf(payload.get("idCliente").toString()));
                turno.setCliente(c);
            }

            if (payload.get("idBarbero") != null) {
                Barbero b = new Barbero();
                b.setIdBarbero(Long.valueOf(payload.get("idBarbero").toString()));
                turno.setBarbero(b);
            }

            if (payload.get("idServicio") != null) {
                Servicio s = new Servicio();
                s.setIdServicio(Long.valueOf(payload.get("idServicio").toString()));
                turno.setServicio(s);
            }

            if (payload.get("idSucursal") != null) {
                Sucursal suc = new Sucursal();
                suc.setIdSucursal(Long.valueOf(payload.get("idSucursal").toString()));
                turno.setSucursal(suc);
            }

            Turno nuevoTurno = turnoService.agendar(turno);
            return ResponseEntity.ok(nuevoTurno);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar turno: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstadoTurno(@PathVariable Long id, @RequestParam String nuevoEstado) {
        Optional<Turno> turnoActualizado = turnoService.cambiarEstado(id, nuevoEstado);
        if (turnoActualizado.isPresent()) {
            return ResponseEntity.ok(turnoActualizado.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTurno(@PathVariable Long id) {
        turnoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}