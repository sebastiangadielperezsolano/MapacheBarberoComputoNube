package tecnm.equipo4.barberoApi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/diponibilidad")
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
        if (dispOptional.isPresent()) {
            return ResponseEntity.ok(dispOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DisponibilidadBarbero> create(@RequestBody DisponibilidadBarbero disp, UriComponentsBuilder ucb) {
        Optional<Barbero> barberoOptional = barberoRepository.findById(disp.getBarbero().getIdBarbero());
        if (!barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        disp.setBarbero(barberoOptional.get());
        DisponibilidadBarbero created = dispRepository.save(disp);
        URI uri = ucb.path("disponibilidad/{idDisponibilidad}").buildAndExpand(created.getIdDisponibilidad()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idDisponibilidad}")
    ResponseEntity<Void> update(@PathVariable Long idDisponibilidad, @RequestBody DisponibilidadBarbero disp) {
        Optional<Barbero> barberoOptional = barberoRepository.findById(disp.getBarbero().getIdBarbero());
        if (!barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        DisponibilidadBarbero dispAnt = dispRepository.findById(idDisponibilidad).get();
        if (dispAnt != null) {
            disp.setBarbero(barberoOptional.get());
            disp.setIdDisponibilidad(dispAnt.getIdDisponibilidad());
            dispRepository.save(disp);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idDiponibilidad}")
    public ResponseEntity<Void> delete(@PathVariable Long idDisponibilidad) {
        if (dispRepository.findById(idDisponibilidad).isPresent()) {
            dispRepository.deleteById(idDisponibilidad);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
