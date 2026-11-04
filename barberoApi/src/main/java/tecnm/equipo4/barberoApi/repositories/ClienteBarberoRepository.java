package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.ClienteBarbero;

import java.util.List;
import java.util.Optional;

public interface ClienteBarberoRepository extends CrudRepository<ClienteBarbero, Long> {
    List<ClienteBarbero> findByCliente_IdCliente(Long idCliente);
    List<ClienteBarbero> findByBarbero_IdBarbero(Long idBarbero);
    Optional<ClienteBarbero> findFirstByCliente_IdClienteAndBarbero_IdBarbero(Long idCliente, Long idBarbero);
}
