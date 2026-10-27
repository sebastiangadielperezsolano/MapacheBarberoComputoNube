package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;

    // 1. Obtener todos los clientes usando Iterable
    @GetMapping
    public ResponseEntity<Iterable<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    // 2. Obtener un cliente por su id_usuario
    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerClientePorId(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(idCliente);
        Optional<Barbero> barberoOpt = barberoRepository.findById(idCliente);
        if (clienteOpt.isPresent() || barberoOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            Barbero barbero = barberoOpt.get();
            String fotoBase64 = (cliente.getFoto() != null) ? new String(cliente.getFoto()) : "";

            return ResponseEntity.ok(Map.of(
                    "id_usuario", cliente.getIdCliente(),
                    "id_barbero", barbero.getIdBarbero(),
                "foto", fotoBase64
            ));
        }
        return ResponseEntity.notFound().build();
    }

    // 3. Crear cliente
    @PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteRepository.save(cliente));
    }

    // 4. Actualizar cliente o foto
    @PutMapping("/{idUsuario}")
    public ResponseEntity<?> actualizarCliente(@PathVariable Long idCliente, @RequestBody Map<String, Object> payload) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(idCliente);
        Optional<Barbero> barberoOpt = barberoRepository.findById(idCliente);

        Cliente cliente = clienteOpt.orElseGet(() -> {
            Cliente nuevo = new Cliente();
            nuevo.setIdCliente(idCliente);
            return nuevo;
        });

        Barbero barbero = barberoOpt.get();
        if (payload.containsKey("id_barbero") && payload.get("id_barbero") != null) {
            barbero.setIdBarbero(Long.valueOf(payload.get("id_barbero").toString()));
        }

        if (payload.containsKey("foto") && payload.get("foto") != null) {
            String fotoStr = (String) payload.get("foto");
            cliente.setFoto(fotoStr.getBytes());
        }

        Cliente guardado = clienteRepository.save(cliente);
        Barbero guardadoBarbero = barberoRepository.save(barbero);

        return ResponseEntity.ok(Map.of(
                "id_usuario", guardado.getIdCliente(),
                "id_barbero", guardadoBarbero.getIdBarbero(),
            "mensaje", "Cliente actualizado correctamente"
        ));
    }
}