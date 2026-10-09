package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.services.TurnoService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<Turno>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) String estado) {
        if (fecha != null) {
            return ResponseEntity.ok(turnoService.listarPorFecha(fecha));
        }
        if (estado != null && !estado.isBlank()) {
            return ResponseEntity.ok(turnoService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(turnoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turno> obtener(@PathVariable Long id) {
        return turnoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Turno> agendar(@RequestBody Turno turno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(turnoService.agendar(turno));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Turno> actualizarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        return turnoService.cambiarEstado(id, nuevoEstado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        turnoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}