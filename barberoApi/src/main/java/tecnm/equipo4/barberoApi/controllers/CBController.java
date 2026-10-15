package tecnm.equipo4.barberoApi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.ClienteBarbero;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteBarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;

import java.net.URI;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/clienteController")
public class CBController {
    private final ClienteBarberoRepository cbRepository;
    private final ClienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;

    @Operation(summary = "Listar todos los clientes-barberos")
    @GetMapping
    public ResponseEntity<Iterable<ClienteBarbero>> findAll() {
        return ResponseEntity.ok(cbRepository.findAll());
    }

    @Operation(summary = "Obtener por ID")
    @GetMapping("{idCB}")
    public ResponseEntity<ClienteBarbero> findById(@PathVariable Long idCB) {
        Optional<ClienteBarbero> cb = cbRepository.findById(idCB);
        return cb.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear un nuevo Cliente-Barbero")
    @PostMapping
    public ResponseEntity<ClienteBarbero> create(@RequestBody ClienteBarbero cb, UriComponentsBuilder ucb) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(cb.getCliente().getIdCliente());
        Optional<Barbero> barberoOptional = barberoRepository.findById(cb.getBarbero().getIdBarbero());

        if (!clienteOptional.isPresent() || !barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        cb.setCliente(clienteOptional.get());
        cb.setBarbero(barberoOptional.get());

        ClienteBarbero created = cbRepository.save(cb);

        URI uri = ucb.path("clienteBarbero/{idCB}").buildAndExpand(created.getIdCB()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{idCB}")
    public ResponseEntity<Void> update(@PathVariable Long idCB, @RequestBody ClienteBarbero cb) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(cb.getCliente().getIdCliente());
        Optional<Barbero> barberoOptional = barberoRepository.findById(cb.getBarbero().getIdBarbero());

        if (!clienteOptional.isPresent() || !barberoOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        ClienteBarbero cbAnterior = cbRepository.findById(idCB).get();
        if (cbAnterior != null) {
            cb.setCliente(clienteOptional.get());
            cb.setBarbero(barberoOptional.get());
            cbRepository.save(cb);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idCB}")
    public ResponseEntity<Void> delete(@PathVariable Long idCB) {
        if (cbRepository.findById(idCB).isPresent()) {
            cbRepository.deleteById(idCB);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
