package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/barbero")
@CrossOrigin(origins = "*")
public class BarberoController {

    private final BarberoRepository barberoRepository;

    @GetMapping
    public ResponseEntity<?> findAll() {
        try {
            Iterable<Barbero> barberos = barberoRepository.findAll();
            return ResponseEntity.ok(barberos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al consultar barberos: " + e.getMessage());
        }
    }

    @GetMapping("/{idBarbero}")
    public ResponseEntity<Barbero> findById(@PathVariable Long idBarbero) {
        Optional<Barbero> barberoOptional = barberoRepository.findById(idBarbero);
        return barberoOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Barbero newBarbero, UriComponentsBuilder ucb) {
        try {
            if (newBarbero.getTipoUsuario() == null) {
                newBarbero.setTipoUsuario("BARBERO");
            }
            Barbero savedBarbero = barberoRepository.save(newBarbero);
            URI uri = ucb.path("/barbero/{idBarbero}")
                    .buildAndExpand(savedBarbero.getIdBarbero())
                    .toUri();
            return ResponseEntity.created(uri).body(savedBarbero);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el barbero: " + e.getMessage());
        }
    }

    @PutMapping("/{idBarbero}")
    public ResponseEntity<Void> update(@PathVariable Long idBarbero, @RequestBody Barbero putBarbero) {
        Optional<Barbero> barberoAnt = barberoRepository.findById(idBarbero);
        if (barberoAnt.isPresent()) {
            putBarbero.setIdBarbero(idBarbero);
            barberoRepository.save(putBarbero);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idBarbero}")
    public ResponseEntity<Void> delete(@PathVariable Long idBarbero) {
        if (barberoRepository.findById(idBarbero).isPresent()) {
            barberoRepository.deleteById(idBarbero);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}