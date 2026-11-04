package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    @GetMapping
    public ResponseEntity<Iterable<Cliente>> findAll() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<Cliente> findById(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        return clienteOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente newCliente, UriComponentsBuilder ucb) {
        Cliente savedCliente = clienteRepository.save(newCliente);
        URI uri = ucb.path("/cliente/{idCliente}")
                .buildAndExpand(savedCliente.getIdCliente())
                .toUri();
        return ResponseEntity.created(uri).body(savedCliente);
    }

    @PutMapping("/{idCliente}")
    public ResponseEntity<Void> update(@PathVariable Long idCliente, @RequestBody Cliente putCliente) {
        Optional<Cliente> clienteAnt = clienteRepository.findById(idCliente);
        if (clienteAnt.isPresent()) {
            putCliente.setIdCliente(idCliente);
            clienteRepository.save(putCliente);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idCliente}")
    public ResponseEntity<Void> delete(@PathVariable Long idCliente) {
        if (clienteRepository.findById(idCliente).isPresent()) {
            clienteRepository.deleteById(idCliente);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}