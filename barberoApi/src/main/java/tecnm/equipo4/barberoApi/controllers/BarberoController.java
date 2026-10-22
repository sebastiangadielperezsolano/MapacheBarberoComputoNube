package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.models.Usuario;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;
import tecnm.equipo4.barberoApi.repositories.UsuarioRepository;

import java.util.*;

@RestController
@RequestMapping("/api/barberos")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BarberoController {

    private final UsuarioRepository usuarioRepository;
    private final BarberoRepository barberoRepository;
    private final TurnoRepository turnoRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarBarberosCompletos() {
        List<Usuario> usuariosBarberos = usuarioRepository.findAll().stream()
                .filter(u -> "BARBERO".equalsIgnoreCase(u.getTipoUsuario()) || "BARBERO".equalsIgnoreCase(u.getPerfil()))
                .toList();

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Usuario u : usuariosBarberos) {
            Map<String, Object> map = new HashMap<>();
            map.put("idBarbero", u.getIdUsuario());
            map.put("nombreCompleto", u.getNombreCompleto());
            map.put("email", u.getEmail());
            map.put("telefono", u.getTelefono() != null ? u.getTelefono() : "");

            Optional<Barbero> bOpt = barberoRepository.findById(u.getIdUsuario());
            map.put("experiencia", bOpt.map(Barbero::getExperiencia).orElse(1));
            map.put("tituloRol", bOpt.map(Barbero::getTituloRol).orElse("Barbero Profesional"));

            resultado.add(map);
        }

        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarBarbero(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");

            Optional<Usuario> existenteOpt = usuarioRepository.findByEmail(email);
            Usuario usuario = existenteOpt.orElseGet(Usuario::new);

            usuario.setNombreCompleto((String) payload.get("nombreCompleto"));
            usuario.setEmail(email);
            usuario.setTelefono((String) payload.get("telefono"));
            usuario.setPassword((String) payload.get("password"));
            usuario.setPerfil("BARBERO");
            usuario.setTipoUsuario("BARBERO");

            Usuario usuarioGuardado = usuarioRepository.save(usuario);

            int experiencia = 1;
            if (payload.containsKey("experiencia") && payload.get("experiencia") != null) {
                try {
                    experiencia = Integer.parseInt(payload.get("experiencia").toString());
                } catch (Exception ignored) {}
            }
            String tituloRol = payload.getOrDefault("tituloRol", "Master Barber").toString();

            barberoRepository.registrarOActualizarBarbero(usuarioGuardado.getIdUsuario(), experiencia, tituloRol);

            return ResponseEntity.ok(Map.of(
                "id_usuario", usuarioGuardado.getIdUsuario(),
                "nombre_completo", usuarioGuardado.getNombreCompleto(),
                "email", usuarioGuardado.getEmail(),
                "tipo_usuario", "BARBERO",
                "mensaje", "Barbero registrado y activado con éxito"
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al registrar barbero: " + e.getMessage());
        }
    }

    @GetMapping("/{idBarbero}/turnos")
    public ResponseEntity<List<Turno>> obtenerTurnosBarbero(@PathVariable Long idBarbero) {
        return ResponseEntity.ok(turnoRepository.findAll().stream()
                .filter(t -> t.getIdBarbero() != null && t.getIdBarbero().equals(idBarbero))
                .toList());
    }
}