package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Cliente;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cliente")
public class ClienteController {
    private final ClienteRepository clienteRepository;

    //Consulta todos los clientes
    @GetMapping
    public ResponseEntity<Iterable<Cliente>> findAll() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    //Consulta cliente por su identificador
    @GetMapping("/{idUsuario}")
    public ResponseEntity<Cliente> findById(@PathVariable Long idUsuario) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idUsuario);
        return clienteOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Crear un cliente
    @PostMapping("/{idUsuario}")
    public ResponseEntity<?> create(@RequestBody Cliente newCliente, UriComponentsBuilder ucb) {
        Cliente savedCliente = clienteRepository.save(newCliente);
        URI uri = ucb.path("cliente/{idUsuario}")
                .buildAndExpand(savedCliente.getIdUsuario())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    //Actualizar un cliente
    @PutMapping("/{idUsuario}")
    public ResponseEntity<?> update(@PathVariable Long idUsuario, @RequestBody Cliente putCliente) {
        Optional<Cliente> clienteAnt = clienteRepository.findById(idUsuario);
        if (clienteAnt.isPresent()) {
            putCliente.setIdUsuario(idUsuario);
            clienteRepository.save(putCliente);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    //Eliminar un cliente
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<?> delete(@PathVariable Long idUsuario) {
        if (clienteRepository.findById(idUsuario).isPresent()) {
            clienteRepository.deleteById(idUsuario);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }
}
