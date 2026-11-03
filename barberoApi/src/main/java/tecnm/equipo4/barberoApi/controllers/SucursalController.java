package tecnm.equipo4.barberoApi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tecnm.equipo4.barberoApi.models.Sucursal;
import tecnm.equipo4.barberoApi.services.SucursalService;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SucursalController {

    private final SucursalService sucursalService;

    @GetMapping
    public ResponseEntity<List<Sucursal>> listar(@RequestParam(required = false) String nombre) {
        if (nombre != null && !nombre.trim().isEmpty()) {
            return ResponseEntity.ok(sucursalService.buscarPorNombre(nombre));
        }
        return ResponseEntity.ok(sucursalService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> obtenerPorId(@PathVariable Long id) {
        return sucursalService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sucursal> crear(@RequestBody Sucursal sucursal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sucursalService.guardarOActualizar(sucursal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> actualizar(@PathVariable Long id, @RequestBody Sucursal sucursal) {
        return sucursalService.buscarPorId(id)
                .map(existente -> {
                    sucursal.setIdSucursal(id);
                    return ResponseEntity.ok(sucursalService.guardarOActualizar(sucursal));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        sucursalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    //hola
}