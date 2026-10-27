package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Usuario;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;
import tecnm.equipo4.barberoApi.repositories.UsuarioRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;

    // 1. REGISTRO DE CLIENTES
    @PostMapping("/registro")
    public ResponseEntity<?> registrarCliente(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");

            if (usuarioRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("mensaje", "El correo ya está registrado"));
            }

            Usuario usuario = new Usuario();
            usuario.setNombreCompleto((String) payload.getOrDefault("nombreCompleto", payload.get("nombre_completo")));
            usuario.setEmail(email);
            usuario.setTelefono((String) payload.get("telefono"));
            usuario.setPassword((String) payload.get("password"));
            usuario.setPerfil("CLIENTE");
            usuario.setTipoUsuario("CLIENTE");

            Usuario usuarioGuardado = usuarioRepository.save(usuario);

            // Inicializar en la tabla cliente
            try {
                Cliente cliente = new Cliente();
                cliente.setIdUsuario(usuarioGuardado.getIdUsuario());
                cliente.setIdBarbero(2L); // Barbero por defecto (Bruno)
                clienteRepository.save(cliente);
            } catch (Exception exCliente) {
                System.out.println("Aviso al crear entidad cliente: " + exCliente.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                "id_usuario", usuarioGuardado.getIdUsuario(),
                "nombre_completo", usuarioGuardado.getNombreCompleto(),
                "email", usuarioGuardado.getEmail(),
                "tipo_usuario", "CLIENTE",
                "mensaje", "Cliente registrado exitosamente"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("mensaje", "Error interno al registrar cliente: " + e.getMessage()));
        }
    }

    // 2. INICIO DE SESIÓN
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

    // 3. LISTAR CLIENTES
    @GetMapping("/clientes")
    public ResponseEntity<List<Usuario>> listarClientes() {
        return ResponseEntity.ok(usuarioRepository.findAll().stream()
                .filter(u -> "CLIENTE".equalsIgnoreCase(u.getTipoUsuario()) || "CLIENTE".equalsIgnoreCase(u.getPerfil()))
                .toList());
    }

    // 4. LISTAR BARBEROS
    @GetMapping("/barberos")
    public ResponseEntity<List<Usuario>> listarBarberos() {
        return ResponseEntity.ok(usuarioRepository.findAll().stream()
                .filter(u -> "BARBERO".equalsIgnoreCase(u.getTipoUsuario()) || "BARBERO".equalsIgnoreCase(u.getPerfil()))
                .toList());
    }

    // 5. OBTENER USUARIO POR ID
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

    // 6. ACTUALIZAR PERFIL Y FOTO
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
                nuevo.setIdBarbero(2L);
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