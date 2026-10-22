package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Usuario;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;
import tecnm.equipo4.barberoApi.repositories.UsuarioRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailAndPassword(email, password);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            return ResponseEntity.ok(Map.of(
                "id_usuario", u.getIdUsuario(),
                "nombre_completo", u.getNombreCompleto(),
                "email", u.getEmail(),
                "telefono", u.getTelefono() != null ? u.getTelefono() : "",
                "perfil", u.getPerfil() != null ? u.getPerfil() : "CLIENTE",
                "tipo_usuario", u.getTipoUsuario() != null ? u.getTipoUsuario() : "CLIENTE"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("mensaje", "Credenciales incorrectas"));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuario.getTipoUsuario() == null || usuario.getTipoUsuario().isEmpty()) {
            usuario.setTipoUsuario("CLIENTE");
        }
        if (usuario.getPerfil() == null || usuario.getPerfil().isEmpty()) {
            usuario.setPerfil("CLIENTE");
        }
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        if ("CLIENTE".equalsIgnoreCase(nuevoUsuario.getTipoUsuario())) {
            Cliente nuevoCliente = new Cliente();
            nuevoCliente.setIdUsuario(nuevoUsuario.getIdUsuario());
            clienteRepository.save(nuevoCliente);
        }

        return ResponseEntity.ok(nuevoUsuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            String fotoBase64 = "";

            Optional<Cliente> clienteOpt = clienteRepository.findById(id);
            if (clienteOpt.isPresent() && clienteOpt.get().getFoto() != null) {
                fotoBase64 = new String(clienteOpt.get().getFoto());
            }

            return ResponseEntity.ok(Map.of(
                "id_usuario", u.getIdUsuario(),
                "nombre_completo", u.getNombreCompleto(),
                "email", u.getEmail(),
                "telefono", u.getTelefono() != null ? u.getTelefono() : "",
                "tipo_usuario", u.getTipoUsuario() != null ? u.getTipoUsuario() : "CLIENTE",
                "foto", fotoBase64
            ));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Usuario u = usuarioOpt.get();
        if (payload.containsKey("nombre_completo")) {
            u.setNombreCompleto((String) payload.get("nombre_completo"));
        }
        if (payload.containsKey("email")) {
            u.setEmail((String) payload.get("email"));
        }
        if (payload.containsKey("telefono")) {
            u.setTelefono((String) payload.get("telefono"));
        }
        if (payload.containsKey("password") && payload.get("password") != null && !((String) payload.get("password")).trim().isEmpty()) {
            u.setPassword((String) payload.get("password"));
        }
        Usuario actualizado = usuarioRepository.save(u);

        if (payload.containsKey("foto") && payload.get("foto") != null) {
            String fotoStr = (String) payload.get("foto");
            Cliente c = clienteRepository.findById(id).orElseGet(() -> {
                Cliente nuevo = new Cliente();
                nuevo.setIdUsuario(id);
                return nuevo;
            });
            c.setFoto(fotoStr.getBytes());
            clienteRepository.save(c);
        }

        return ResponseEntity.ok(Map.of(
            "id_usuario", actualizado.getIdUsuario(),
            "nombre_completo", actualizado.getNombreCompleto(),
            "email", actualizado.getEmail(),
            "telefono", actualizado.getTelefono() != null ? actualizado.getTelefono() : "",
            "tipo_usuario", actualizado.getTipoUsuario()
        ));
    }
}