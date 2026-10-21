package tecnm.equipo4.barberoApi.controllers;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Usuario;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;
import tecnm.equipo4.barberoApi.repositories.UsuarioRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1. Buscar primero en la tabla general Usuario (para Barberos u otros usuarios del sistema)
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.get());
        }

        Optional<Cliente> clienteOptional = clienteRepository.findByEmailAndPassword(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get());
        }

        // 3. Si no existe en ninguno
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Correo o contraseña incorrectos"));
    }

    // DTO interno para mapear la petición JSON de React ({ "email": "...", "password": "..." })
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}