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
@RequestMapping("/cliente")
public class ClienteController {
    private final ClienteRepository clienteRepository;

    //Consulta todos los clientes
    @GetMapping
    public ResponseEntity<Iterable<Cliente>> findAll() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    //Consulta cliente por su identificador
    @GetMapping("/{idCliente}")
    public ResponseEntity<Cliente> findById(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        return clienteOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Crear un cliente
    @PostMapping("/{idCliente}")
    public ResponseEntity<?> create(@RequestBody Cliente newCliente, UriComponentsBuilder ucb) {
        Cliente savedCliente = clienteRepository.save(newCliente);
        URI uri = ucb.path("cliente/{idUsuario}")
                .buildAndExpand(savedCliente.getIdCliente())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    //Actualizar un cliente
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

    //Eliminar un cliente
    @DeleteMapping("/{idCliente}")
    public ResponseEntity<?> delete(@PathVariable Long idCliente) {
        if (clienteRepository.findById(idCliente).isPresent()) {
            clienteRepository.deleteById(idCliente);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }
}
