package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.DisponibilidadBarbero;

public interface DisponibilidadRespository extends CrudRepository<DisponibilidadBarbero, Long> {
}
