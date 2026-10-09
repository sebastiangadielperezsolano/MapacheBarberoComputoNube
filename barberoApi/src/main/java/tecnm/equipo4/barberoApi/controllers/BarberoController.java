package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;

import java.net.URI;
import java.util.Optional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/barbero")
public class BarberoController {
    private BarberoRepository barberoRepository;

    @GetMapping()
    public ResponseEntity<Iterable<Barbero>> findAll() {
        return ResponseEntity.ok(barberoRepository.findAll());
    }

    @GetMapping("/{idBarbero}")
    public ResponseEntity<Barbero> findById(@PathVariable Long idBarbero) {
        Optional<Barbero> barberoOptional = barberoRepository.findById(idBarbero);
        return barberoOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Barbero> create(@RequestBody Barbero newBarbero, UriComponentsBuilder ucb) {
        Barbero savedBarbero = barberoRepository.save(newBarbero);
        URI uri = ucb.path("barbero/{idBarbero}")
                .buildAndExpand(savedBarbero.getIdBarbero())
                .toUri();
        return ResponseEntity.created(uri).body(savedBarbero);
    }
}
