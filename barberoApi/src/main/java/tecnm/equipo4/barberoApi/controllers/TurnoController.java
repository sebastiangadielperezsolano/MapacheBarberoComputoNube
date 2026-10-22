package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoRepository turnoRepository;

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Turno>> obtenerTurnosPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(turnoRepository.buscarPorCliente(idCliente));
    }

    @PostMapping
    public ResponseEntity<?> agendarTurno(@RequestBody Turno turno) {
        try {
            if (turno.getEstado() == null || turno.getEstado().trim().isEmpty()) {
                turno.setEstado("CONFIRMADO");
            }
            if (turno.getIdBarbero() == null) {
                turno.setIdBarbero(2L);
            }
            if (turno.getIdServicio() == null) {
                turno.setIdServicio(1L);
            }
            if (turno.getSucursal() == null || turno.getSucursal().trim().isEmpty()) {
                turno.setSucursal("BarberApp Centro");
            }
            Turno nuevoTurno = turnoRepository.save(turno);
            return ResponseEntity.ok(nuevoTurno);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al registrar turno: " + e.getMessage());
        }
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