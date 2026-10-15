package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Servicio;
import tecnm.equipo4.barberoApi.repositories.ServicioRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository servicioRepository;

    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }

    public Optional<Servicio> buscarPorId(Long idServicio) {
        return servicioRepository.findById(idServicio);
    }

    public List<Servicio> buscarPorNombre(String nombreServicio) {
        return servicioRepository.findByNombreServicioContainingIgnoreCase(nombreServicio);
    }

    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public void eliminar(Long idServicio) {
        servicioRepository.deleteById(idServicio);
    }
}