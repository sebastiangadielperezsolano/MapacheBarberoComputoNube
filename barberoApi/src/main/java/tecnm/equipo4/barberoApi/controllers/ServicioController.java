package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Servicio;
import tecnm.equipo4.barberoApi.repositories.ServicioRepository;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioRepository servicioRepository;

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam(required = false) String nombre) {
        try {
            if (nombre != null && !nombre.trim().isEmpty()) {
                return ResponseEntity.ok(servicioRepository.findByNombreServicioContainingIgnoreCase(nombre));
            }
            return ResponseEntity.ok(servicioRepository.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al consultar servicios: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtener(@PathVariable Long id) {
        return servicioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Servicio> crear(@RequestBody Servicio servicio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioRepository.save(servicio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (servicioRepository.existsById(id)) {
            servicioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}