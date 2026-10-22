package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping({"/api/turnos", "/turnos", "/turno"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoRepository turnoRepository;

    @GetMapping
    public ResponseEntity<List<Turno>> obtenerTodosLosTurnos() {
        try {
            List<Turno> lista = turnoRepository.findAll();
            return ResponseEntity.ok(lista != null ? lista : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // Fallback seguro en vacio
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Turno>> obtenerTurnosPorCliente(@PathVariable Long idCliente) {
        try {
            List<Turno> lista = turnoRepository.buscarPorCliente(idCliente);
            return ResponseEntity.ok(lista != null ? lista : new ArrayList<>());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
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
    public ResponseEntity<?> cancelarTurnoPut(@PathVariable Long id) {
        Optional<Turno> turnoOpt = turnoRepository.findById(id);
        if (turnoOpt.isPresent()) {
            Turno turno = turnoOpt.get();
            turno.setEstado("CANCELADO");
            return ResponseEntity.ok(turnoRepository.save(turno));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTurnoDelete(@PathVariable Long id) {
        if (turnoRepository.existsById(id)) {
            turnoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}