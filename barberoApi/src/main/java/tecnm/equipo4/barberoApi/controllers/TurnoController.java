package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;
import tecnm.equipo4.barberoApi.services.TurnoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;
    private final TurnoRepository turnoRepository;

    @GetMapping
    public ResponseEntity<List<Turno>> listar(
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Long idBarbero,
            @RequestParam(required = false) Long idCliente) {

        if (idBarbero != null) {
            return ResponseEntity.ok(turnoService.listarPorBarbero(idBarbero));
        }
        if (idCliente != null) {
            return ResponseEntity.ok(turnoService.listarPorCliente(idCliente));
        }
        if (fecha != null && !fecha.isBlank()) {
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
    public ResponseEntity<?> agendar(@RequestBody Turno turno) {
        try {
            System.out.println(">>> RECIBIENDO TURNO: " + turno);
            Turno nuevoTurno = turnoService.agendar(turno);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTurno);
        } catch (Exception e) {
            System.err.println("¡ERROR CRÍTICO AL AGENDAR!");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "{\"error\": \"" + e.getClass().getName() + " - " + e.getMessage() + "\"}"
            );
        }
    }

    @GetMapping("/ocupados")
    public ResponseEntity<List<String>> obtenerHorariosOcupados(
            @RequestParam Long idBarbero,
            @RequestParam String fecha) {
        try {
            List<Turno> turnosOcupados = turnoService.obtenerHorariosOcupados(idBarbero, fecha);

            List<String> horas = turnosOcupados.stream()
                    .map(Turno::getHoraInicio)
                    .toList();

            return ResponseEntity.ok(horas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{idTurno}")
    public ResponseEntity<?> updateEstado(@PathVariable Long idTurno, @RequestBody Turno turnoActualizado) {
        Optional<Turno> turnoExistente = turnoRepository.findById(idTurno);
        if (turnoExistente.isPresent()) {
            Turno turno = turnoExistente.get();
            turno.setEstado(turnoActualizado.getEstado());
            turnoRepository.save(turno);
            return ResponseEntity.ok(turno);
        }
        return ResponseEntity.notFound().build();
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