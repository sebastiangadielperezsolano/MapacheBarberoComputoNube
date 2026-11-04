package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.services.TurnoService;

import java.util.List;
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
    public ResponseEntity<?> agendarTurno(@RequestBody Turno turno) {
        try {
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