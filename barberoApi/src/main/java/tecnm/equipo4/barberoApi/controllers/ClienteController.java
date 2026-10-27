package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteRepository clienteRepository;

    // 1. Obtener todos los clientes usando Iterable
    @GetMapping
    public ResponseEntity<Iterable<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    // 2. Obtener un cliente por su id_usuario
    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerClientePorId(@PathVariable Long idUsuario) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(idUsuario);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            String fotoBase64 = (cliente.getFoto() != null) ? new String(cliente.getFoto()) : "";

            return ResponseEntity.ok(Map.of(
                "id_usuario", cliente.getIdUsuario(),
                "id_barbero", cliente.getIdBarbero() != null ? cliente.getIdBarbero() : 0,
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
    public ResponseEntity<?> actualizarCliente(@PathVariable Long idUsuario, @RequestBody Map<String, Object> payload) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(idUsuario);

        Cliente cliente = clienteOpt.orElseGet(() -> {
            Cliente nuevo = new Cliente();
            nuevo.setIdUsuario(idUsuario);
            return nuevo;
        });

        if (payload.containsKey("id_barbero") && payload.get("id_barbero") != null) {
            cliente.setIdBarbero(Long.valueOf(payload.get("id_barbero").toString()));
        }

        if (payload.containsKey("foto") && payload.get("foto") != null) {
            String fotoStr = (String) payload.get("foto");
            cliente.setFoto(fotoStr.getBytes());
        }

        Cliente guardado = clienteRepository.save(cliente);

        return ResponseEntity.ok(Map.of(
            "id_usuario", guardado.getIdUsuario(),
            "id_barbero", guardado.getIdBarbero() != null ? guardado.getIdBarbero() : 0,
            "mensaje", "Cliente actualizado correctamente"
        ));
    }
}