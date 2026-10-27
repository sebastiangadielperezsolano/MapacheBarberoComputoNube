package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.DisponibilidadBarbero;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.DisponibilidadRespository;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/disponibilidades")
@CrossOrigin(origins = "*")
public class DisponibilidadController {

    private final DisponibilidadRespository dispRepository;
    private final BarberoRepository barberoRepository;

    @GetMapping
    public ResponseEntity<Iterable<DisponibilidadBarbero>> findAll() {
        return ResponseEntity.ok(dispRepository.findAll());
    }

    @GetMapping("/{idDisponibilidad}")
    public ResponseEntity<DisponibilidadBarbero> findById(@PathVariable Long idDisponibilidad) {
        Optional<DisponibilidadBarbero> dispOptional = dispRepository.findById(idDisponibilidad);
        return dispOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DisponibilidadBarbero> create(@RequestBody DisponibilidadBarbero disp, UriComponentsBuilder ucb) {
        if (disp.getBarbero() == null || disp.getBarbero().getIdBarbero() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Barbero> barberoOptional = barberoRepository.findById(disp.getBarbero().getIdBarbero());
        if (!barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        disp.setBarbero(barberoOptional.get());
        DisponibilidadBarbero created = dispRepository.save(disp);
        URI uri = ucb.path("/api/disponibilidades/{idDisponibilidad}")
                .buildAndExpand(created.getIdDisponibilidad())
                .toUri();

        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idDisponibilidad}")
    public ResponseEntity<Void> update(@PathVariable Long idDisponibilidad, @RequestBody DisponibilidadBarbero disp) {
        if (disp.getBarbero() == null || disp.getBarbero().getIdBarbero() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Barbero> barberoOptional = barberoRepository.findById(disp.getBarbero().getIdBarbero());
        if (!barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Optional<DisponibilidadBarbero> dispAnt = dispRepository.findById(idDisponibilidad);
        if (dispAnt.isPresent()) {
            disp.setBarbero(barberoOptional.get());
            disp.setIdDisponibilidad(idDisponibilidad);
            dispRepository.save(disp);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idDisponibilidad}")
    public ResponseEntity<Void> delete(@PathVariable Long idDisponibilidad) {
        if (dispRepository.findById(idDisponibilidad).isPresent()) {
            dispRepository.deleteById(idDisponibilidad);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}