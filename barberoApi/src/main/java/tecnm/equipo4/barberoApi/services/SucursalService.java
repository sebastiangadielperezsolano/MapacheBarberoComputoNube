package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Sucursal;
import tecnm.equipo4.barberoApi.repositories.SucursalRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SucursalService {

    private final SucursalRepository sucursalRepository;

    public List<Sucursal> listarTodos() {
        return sucursalRepository.findAll();
    }

    public Optional<Sucursal> buscarPorId(Long idSucursal) {
        return sucursalRepository.findById(idSucursal);
    }

    public List<Sucursal> buscarPorNombre(String nombre) {
        return sucursalRepository.findByNombreSucursalContainingIgnoreCase(nombre);
    }

    public Sucursal guardarOActualizar(Sucursal sucursal) {
        return sucursalRepository.save(sucursal);
    }

    public void eliminar(Long idSucursal) {
        sucursalRepository.deleteById(idSucursal);
    }
}

