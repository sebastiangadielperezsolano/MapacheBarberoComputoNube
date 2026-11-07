package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Sucursal;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.SucursalRepository;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/barbero")
public class BarberoController {
    private final BarberoRepository barberoRepository;
    private final SucursalRepository sucursalRepository; // Añadido para validar la sucursal

    @GetMapping
    public ResponseEntity<Iterable<Barbero>> findAll() {
        return ResponseEntity.ok(barberoRepository.findAll());
    }

    @GetMapping("/{idBarbero}")
    public ResponseEntity<Barbero> findById(@PathVariable Long idBarbero) {
        Optional<Barbero> barberoOptional = barberoRepository.findById(idBarbero);
        return barberoOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload, UriComponentsBuilder ucb) {
        try {
            Barbero newBarbero = new Barbero();
            newBarbero.setNombreCompleto((String) payload.get("nombreCompleto"));
            newBarbero.setTelefono((String) payload.get("telefono"));
            newBarbero.setEmail((String) payload.get("email"));
            newBarbero.setPassword((String) payload.get("password"));
            newBarbero.setTipoUsuario((String) payload.get("tipoUsuario"));
            newBarbero.setTituloRol((String) payload.get("tituloRol"));
            newBarbero.setExperiencia(Integer.parseInt(payload.get("experiencia").toString()));

            // Vincular Sucursal
            if (payload.get("sucursal") != null) {
                Map<String, Object> sucursalMap = (Map<String, Object>) payload.get("sucursal");
                Long idSucursal = Long.valueOf(sucursalMap.get("idSucursal").toString());

                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if(sucursalOpt.isPresent()){
                    newBarbero.setSucursal(sucursalOpt.get());
                } else {
                    return ResponseEntity.badRequest().body("La sucursal seleccionada no existe en la base de datos.");
                }
            } else {
                return ResponseEntity.badRequest().body("Es obligatorio asignar una sucursal al barbero.");
            }

            Barbero savedBarbero = barberoRepository.save(newBarbero);
            URI uri = ucb.path("/barbero/{idBarbero}")
                    .buildAndExpand(savedBarbero.getIdBarbero())
                    .toUri();
            return ResponseEntity.created(uri).body(savedBarbero);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        }
    }

    @PutMapping("/{idBarbero}")
    public ResponseEntity<Void> update(@PathVariable Long idBarbero, @RequestBody Barbero putBarbero) {
        Optional<Barbero> barberoAnt = barberoRepository.findById(idBarbero);
        if (barberoAnt.isPresent()) {
            putBarbero.setIdBarbero(idBarbero);
            barberoRepository.save(putBarbero);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idBarbero}")
    public ResponseEntity<Void> delete(@PathVariable Long idBarbero) {
        if (barberoRepository.findById(idBarbero).isPresent()) {
            barberoRepository.deleteById(idBarbero);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}