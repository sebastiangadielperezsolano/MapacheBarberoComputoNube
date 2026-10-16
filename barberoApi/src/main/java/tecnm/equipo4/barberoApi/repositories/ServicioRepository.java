package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Servicio;

import java.util.List;

@Repository
public interface ServicioRepository extends CrudRepository<Servicio, Long> {
    List<Servicio> findByNombreServicioContainingIgnoreCase(String nombreServicio);
}