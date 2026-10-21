package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cliente")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;

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
    public ResponseEntity<?> create(@RequestBody Cliente newCliente, UriComponentsBuilder ucb) {
        try {
            if (newCliente.getTipoUsuario() == null || newCliente.getTipoUsuario().trim().isEmpty()) {
                newCliente.setTipoUsuario("CLIENTE");
            }

            if (newCliente.getPerfil() == null || newCliente.getPerfil().trim().isEmpty()) {
                newCliente.setPerfil("CLIENTE");
            }

            if (newCliente.getBarbero() == null) {
                Optional<Barbero> defaultBarbero = barberoRepository.findById(1L);
                defaultBarbero.ifPresent(newCliente::setBarbero);
            }

            Cliente savedCliente = clienteRepository.save(newCliente);

            URI uri = ucb.path("/cliente/{idCliente}")
                    .buildAndExpand(savedCliente.getIdCliente())
                    .toUri();

            return ResponseEntity.created(uri).body(savedCliente);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el cliente: " + e.getMessage());
        }
    }

    @PutMapping("/{idCliente}")
    public ResponseEntity<?> update(@PathVariable Long idCliente, @RequestBody Cliente putCliente) {
        Optional<Cliente> clienteAnt = clienteRepository.findById(idCliente);
        if (clienteAnt.isPresent()) {
            putCliente.setIdCliente(idCliente);
            clienteRepository.save(putCliente);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idCliente}")
    public ResponseEntity<?> delete(@PathVariable Long idCliente) {
        if (clienteRepository.findById(idCliente).isPresent()) {
            clienteRepository.deleteById(idCliente);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}